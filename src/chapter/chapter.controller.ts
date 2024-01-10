import { Controller } from '@nestjs/common';
import { ChapterService } from './chapter.service';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}
}
