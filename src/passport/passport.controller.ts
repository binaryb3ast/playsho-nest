import { Controller } from '@nestjs/common';
import { PassportService } from './passport.service';

@Controller('passport')
export class PassportController {
  constructor(private readonly passportService: PassportService) {}
}
