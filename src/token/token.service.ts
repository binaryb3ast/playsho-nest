import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './token.entity';
import { TokenCreateDto } from './dto/token.create.dto';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private readonly model: Model<Token>) {}

  async findOneByDevice(
    device: any,
    projection = '',
  ): Promise<Token> {
    return this.model.findOne({ device  }).select(projection);
  }

  async findByIdentifier(identifier: string, projection = ''): Promise<Token> {
    return this.model.findOne({ identifier }).select(projection);
  }

  async create(payload: TokenCreateDto): Promise<Token> {
    return await new this.model(payload).save();
  }

  async updateIdentifier(id: any, identifier: string): Promise<Token> {
    return this.model.findByIdAndUpdate(
      id,
      {
        identifier: identifier,
      },
      { new: true },
    );
  }

  async updatePublicKey(id: any, public_key: string): Promise<Token> {
    return this.model.findByIdAndUpdate(
      id,
      {
        public_key: public_key,
      },
      { new: true },
    );
  }


}
