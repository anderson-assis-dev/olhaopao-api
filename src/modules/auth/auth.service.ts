import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserType, UserRole } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Delicatessen, DocumentType } from '../delicatessen/entities/delicatessen.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Delicatessen)
    private delicatessenRepository: Repository<Delicatessen>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; user: User }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    if (registerDto.userType === UserType.CLIENT) {
      return this.registerClient(registerDto);
    }

    if (registerDto.userType === UserType.DELICATESSEN) {
      return this.registerDelicatessen(registerDto);
    }

    throw new BadRequestException('Invalid user type');
  }

  private async registerClient(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; user: User }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = queryRunner.manager.create(User, {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        userType: UserType.CLIENT,
        role: UserRole.CUSTOMER,
      });

      await queryRunner.manager.save(user);

      const client = queryRunner.manager.create(Client, {
        userId: user.id,
        cpf: registerDto.clientData?.cpf,
        phone: registerDto.clientData?.phone,
      });

      await queryRunner.manager.save(client);

      await queryRunner.commitTransaction();

      const accessToken = this.generateToken(user);

      return { accessToken, user };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async registerDelicatessen(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; user: User }> {
    if (!registerDto.delicatessenData) {
      throw new BadRequestException('Delicatessen data is required');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = queryRunner.manager.create(User, {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        userType: UserType.DELICATESSEN,
        role: UserRole.MANAGER,
      });

      await queryRunner.manager.save(user);

      const delicatessenData = registerDto.delicatessenData;
      const delicatessen = queryRunner.manager.create(Delicatessen, {
        name: delicatessenData.name,
        tradeName: delicatessenData.tradeName,
        document: delicatessenData.document,
        documentType: (delicatessenData.documentType as DocumentType) || DocumentType.CNPJ,
        email: delicatessenData.email,
        phone: delicatessenData.phone,
        whatsapp: delicatessenData.whatsapp,
        address: delicatessenData.address,
        addressNumber: delicatessenData.addressNumber,
        complement: delicatessenData.complement,
        neighborhood: delicatessenData.neighborhood,
        city: delicatessenData.city,
        state: delicatessenData.state,
        zipCode: delicatessenData.zipCode,
        ownerId: user.id,
      });

      await queryRunner.manager.save(delicatessen);

      user.delicatessenId = delicatessen.id;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      const accessToken = this.generateToken(user);

      return { accessToken, user };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['delicatessen', 'client'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const accessToken = this.generateToken(user);

    return { accessToken, user };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
    };
    return this.jwtService.sign(payload);
  }
}
