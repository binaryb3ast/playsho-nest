import { Controller } from '@nestjs/common';
import { MajorService } from './major.service';

@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}
}
