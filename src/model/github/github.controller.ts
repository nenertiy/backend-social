import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { Controller, Get, Param } from '@nestjs/common';

@ApiTags('Github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @ApiOperation({ summary: '' })
  @Get(':github')
  findGithubProfile(@Param('github') github: string) {
    return this.githubService.findGithubProfile(github);
  }

  @ApiOperation({ summary: '' })
  @Get(':github/rep')
  findGithubRep(@Param('github') github: string) {
    return this.githubService.findGithubRep(github);
  }
}
