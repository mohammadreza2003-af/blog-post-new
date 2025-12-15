import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import express from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: express.Request,
  ) {}
  public async paginationQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const data = await repository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newURL = new URL(this.request.url, baseURL);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;

    const finalResponse: Paginated<T> = {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?page=1&limit=${limit}`,
        last: `${newURL.origin}${newURL.pathname}?page=${totalPages}&limit=${limit}`,
        current: `${newURL.origin}${newURL.pathname}?page=${page}&limit=${limit}`,
        previous: `${newURL.origin}${newURL.pathname}?page=${previousPage}&limit=${limit}`,
        next: `${newURL.origin}${newURL.pathname}?page=${nextPage}&limit=${limit}`,
      },
    };

    return finalResponse;
  }
}
