import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async findGithubProfile(github: string): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`https://api.github.com/users/${github}`),
    );
    return response.data;
  }

  async findGithubRep(github: string): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`https://api.github.com/users/${github}/repos`),
    );
    return response.data;
  }
}
