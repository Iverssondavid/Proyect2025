import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ModalController, IonContent } from '@ionic/angular';
import { AddPostModalPage } from '../add-post-modal/add-post-modal.page';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  posts: any[] = [];
  page: number = 1;
  limit: number = 10;
  hasMore: boolean = true;
  isLoading: boolean = false;
  user_data: any;

  constructor(
    private postService: PostService,
    private modalController: ModalController,
    private router: Router,
    private storage: Storage
  ) {}

  ngOnInit() {
    console.log('Init Home');
    this.loadPosts();
    this.postService.postCreated.subscribe((newPost: any) => {
      this.posts.unshift(newPost);
    });
  }

  async addPost() {
    console.log('Add Post');
    const modal = await this.modalController.create({
      component: AddPostModalPage,
      componentProps: {}
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.user_data = dataReturned.data;
      }
    });
    return await modal.present();
  }

  loadPosts(event?: any) {
    console.log('Load Posts');
    this.isLoading = true;

    this.postService.getPosts(this.page, this.limit).then(
      (data: any) => {
        if (data.length > 0) {
          this.posts = [...this.posts, ...data];
          this.page++;
        } else {
          this.hasMore = false;
        }
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }
    );
  }

}