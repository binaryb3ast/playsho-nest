import { Controller } from '@nestjs/common';
import { FieldofstudyService } from './fieldofstudy.service';

@Controller('fieldofstudy')
export class FieldofstudyController {
  constructor(private readonly fieldofstudyService: FieldofstudyService) {}
}
