import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    if (createUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('電子郵件已被使用');
      }
    }

    // Hash password if provided
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    // Generate session ID if not provided
    if (!createUserDto.sessionId) {
      createUserDto.sessionId = uuidv4();
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    return new UserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('使用者不存在');
    }
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'role', 'isActive'],
    });
  }

  async findBySessionId(sessionId: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({ where: { sessionId } });
    return user ? new UserResponseDto(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('使用者不存在');
    }

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('電子郵件已被使用');
      }
    }

    // Hash password if being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return new UserResponseDto(updatedUser);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('使用者不存在');
    }
    await this.userRepository.softRemove(user);
  }

  async createGuestUser(sessionId?: string): Promise<UserResponseDto> {
    return this.create({
      sessionId: sessionId || uuidv4(),
      role: 'guest' as any,
    });
  }
}
