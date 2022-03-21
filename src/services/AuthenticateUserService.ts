import axios from 'axios';
import { sign } from 'jsonwebtoken';

import { prismaClient } from '../prismaClient';

interface IAccessTokenProps {
  access_token: string;
}

interface IUserResponse {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    // Recuperar o access_token no GITHUB
    const url = 'https://github.com/login/oauth/access_token';

    const { data } = await axios.post<IAccessTokenProps>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET_KEY,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    // Recuperar informações do usuário no GITHUB
    const response = await axios.get<IUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${data.access_token}`,
        },
      },
    );

    // Verifica se existe esse usuário no Prisma
    const { id, name, login, avatar_url } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    // Se o usuário não existir, cria um novo.
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });
    }

    // Criação do token JWT do usuário
    const token = sign(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
        },
      },
      process.env.JWT_SECRET_KEY,
      {
        subject: user.id,
        expiresIn: process.env.JWT_EXPIRE_DATETIME,
      },
    );

    return { user, token };
  }
}

export { AuthenticateUserService };
