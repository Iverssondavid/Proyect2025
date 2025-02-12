import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.page.html',
  styleUrls: ['./search-users.page.scss'],
  standalone: false
})
export class SearchUsersPage implements OnInit {
  users: any[] = [];
  page: number = 1;
  limit: number = 10;
  query: string = '';
  hasMoreUsers: boolean = true; // Corrige el typo de hasHoreUsers → hasMoreUsers
  current_user: any;

  constructor(
    private userService: UserService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this.current_user = await this.storage.get('user');
    this.loadUsers();
  }

  /** Cargar usuarios */
  async loadUsers(event?: any) {
    try {
      const followingUsers = this.current_user?.followees || [];

      const data: any = await this.userService.listUsers(this.page, this.limit, this.query);
      if (data.users.length > 0) {
        this.users = [
          ...this.users,
          ...data.users.map((user: any) => ({
            ...user,
            is_following: followingUsers.some((followedUser: any) => followedUser.id === user.id),
          }))
        ];
        this.page++;
      } else {
        this.hasMoreUsers = false;
      }

      if (event) event.target.complete();
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      if (event) event.target.complete();
    }
  }

  /** Buscar usuarios */
  searchUsers(event: any) {
    this.query = event.target.value || '';
    this.page = 1;
    this.users = [];
    this.hasMoreUsers = true;
    this.loadUsers();
  }

  /** Seguir usuario */
  async follow(followee_id: any) {
    try {
      if (!this.current_user) {
        console.error("Error: Usuario no autenticado.");
        return;
      }

      const user_id = this.current_user.id;
      await this.userService.followUser(user_id, followee_id);
      console.log("Usuario seguido:", followee_id);

      // Actualizar UI y almacenamiento local
      this.current_user.followees = [...(this.current_user.followees || []), { id: followee_id }];
      await this.storage.set("user", this.current_user);

      this.users = this.users.map(user =>
        user.id === followee_id ? { ...user, is_following: true } : user
      );
    } catch (error) {
      console.error("Error al seguir usuario:", error);
    }
  }

  /** Dejar de seguir usuario */
  async unfollow(followee_id: any) {
    try {
      if (!this.current_user) {
        console.error("Error: Usuario no autenticado.");
        return;
      }

      const user_id = this.current_user.id;
      await this.userService.unfollowUser(user_id, followee_id);
      console.log("Usuario dejado de seguir:", followee_id);

      // Filtrar usuarios seguidos y actualizar almacenamiento
      this.current_user.followees = (this.current_user.followees || []).filter(
        (followee: any) => followee.id !== followee_id
      );
      await this.storage.set("user", this.current_user);

      this.users = this.users.map(user =>
        user.id === followee_id ? { ...user, is_following: false } : user
      );
    } catch (error) {
      console.error("Error al dejar de seguir usuario:", error);
    }
  }

  /** Alternar seguir/dejar de seguir */
  toggleFollow(user: any) {
    user.is_following ? this.unfollow(user.id) : this.follow(user.id);
  }
}