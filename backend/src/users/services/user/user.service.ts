import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Block, Friend, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  private logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Block) private blockRepository: Repository<Block>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async findUserByIdOrFail(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      // console.log(`findUserByIdOrFail of id: ${userId} not found,`);
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    return user;
  }

  async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.Block',
        'block',
        'users.user_id = block.user_id',
      )
      .where('users.user_id=:id', { id })
      .getOne();
    return user;
    // return await this.userRepository.findOneBy({ id: id });
  }
  async getUserById(id: number) {
    this.logger.debug(`getUserById() id: ${id}`);
    if (id !== undefined) {
      // const user = await this.userRepository.findOneBy({ id: id });
      // const user = await this.userRepository.findOne({ where: { id } });
      const user = await this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect(
          'users.Block',
          'block',
          'users.user_id = block.user_id',
        )
        .where('users.user_id=:id', { id })
        .getOne();
      // console.log('getUserById() user:', user);
      // this.logger.debug('getUserById() user:');
      // console.log(user);
      // console.log('getuserbyid:', user);
      // if (!user) throw new NotFoundException(`User by #id ${id} not found`);
      return user;
    }
  }

  async getAllUsers() {
    // const users = await this.userRepository.find();
    const users = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.Block',
        'block',
        'users.user_id = block.user_id',
      )
      .getMany();
    // console.log('users info:', users);
    if (users) return users;
  }

  async blockUser(userId: number, blockUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const blockUser = await this.findUserByIdOrFail(blockUserId);
    const block = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .andWhere('block.blocked_user_id=:blockUserId', { blockUserId })
      .getOne();
    if (block) {
      throw new BadRequestException(
        `${user.username} already blocked ${blockUser.username}`,
      );
    }
    const createdBlock = this.blockRepository.create({
      userId,
      blockedUserId: blockUserId,
      User: user,
      BlockedUser: blockUser,
    });
    return await this.blockRepository.save(createdBlock);
  }

  async unBlockUser(userId: number, unBlockUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const unBlockUser = await this.findUserByIdOrFail(unBlockUserId);
    const block = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .andWhere('block.blocked_user_id=:unBlockUserId', { unBlockUserId })
      .getOne();
    if (!block) {
      throw new BadRequestException(
        `${user.username} already unblocked ${unBlockUser.username}`,
      );
    }
    const removedBlock = await this.blockRepository.remove(block);
    // const removedBlock = this.blockRepository
    //   .createQueryBuilder('block')
    //   .delete()
    //   .from(Block)
    //   .where('user_id=:userId', { userId })
    //   .andWhere('blocked_user_id=:unBlockUserId', { unBlockUserId })
    //   .execute();
    console.log('removed block:', removedBlock);
    return removedBlock;
  }

  async getBlockList(userId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const blocks = await this.blockRepository
      .createQueryBuilder('block')
      .where('block.user_id=:userId', { userId })
      .getMany();
    return blocks;
  }

  async addFriend(userId: number, friendUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const friendUser = await this.findUserByIdOrFail(friendUserId);
    const friend = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .andWhere('friend.friend_user_id=:friendUserId', { friendUserId })
      .getOne();
    if (friend) {
      throw new BadRequestException(
        `${user.username} already added ${friendUser.username} as a friend`,
      );
    }
    const createdfriend = this.friendRepository.create({
      userId,
      friendUserId,
      User: user,
      FriendUser: friendUser,
    });
    return await this.friendRepository.save(createdfriend);
  }

  async deleteFriend(userId: number, unFriendUserId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const unFriendUser = await this.findUserByIdOrFail(unFriendUserId);
    const friend = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .andWhere('friend.friend_user_id=:unFriendUserId', { unFriendUserId })
      .getOne();
    if (!friend) {
      throw new BadRequestException(
        `${user.username} already deleted ${unFriendUser.username} from friends list`,
      );
    }
    const removedFriend = await this.friendRepository.remove(friend);
    console.log('removed friend:', removedFriend);
    return removedFriend;
  }

  async getFriendList(userId: number) {
    const user = await this.findUserByIdOrFail(userId);
    const friends = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.user_id=:userId', { userId })
      .getMany();
    return friends;
  }
  // updateUserById(id: number) {}
}
