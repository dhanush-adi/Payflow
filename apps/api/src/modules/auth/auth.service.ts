import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await // @ts-ignore
    this.prisma.user.findUnique({ where: { email } });
    if (user) return user;
    return null;
  }

  async login(email: string) {
    const user = await this.validateUser(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async register(email: string, name: string, phone?: string) {
    const existing = await // @ts-ignore
    this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new UnauthorizedException('User already exists');
    
    const user = await // @ts-ignore
    this.prisma.user.create({
      data: { email, name, phone, role: 'USER' as any },
    });
    
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}