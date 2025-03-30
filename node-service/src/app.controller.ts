import { Controller, Post } from '@nestjs/common';
import axios from 'axios';

@Controller('ingestion')
export class IngestionController {
  @Post('trigger')
  async triggerIngestion() {
    const response = await axios.post('http://python-backend-url/ingest', {});
    return response.data;
  }
}
