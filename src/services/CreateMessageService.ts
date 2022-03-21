import { io } from '../app';
import { prismaClient } from '../prismaClient';

interface IRequestProps {
  user_id: string;
  text: string;
}

class CreateMessageService {
  async execute({ user_id, text }: IRequestProps) {
    const message = await prismaClient.message.create({
      data: {
        user_id,
        text,
      },
      // Retorna também todos os dados do usuário
      include: {
        user: true,
      },
    });

    const infoWS = {
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    io.emit('new_message', infoWS);

    return message;
  }
}

export { CreateMessageService };
