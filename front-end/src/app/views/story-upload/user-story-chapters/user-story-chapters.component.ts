import { Component, OnInit, ViewChild } from '@angular/core';
import { StoriesChapter } from 'src/app/models/stories-chapter';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { Page } from 'src/app/models/page';
import { StoryChaptersService } from 'src/app/services/story-chapters.service';
import { PnotifyService } from 'src/app/utils/pnotify.service';


@Component({
  selector: 'app-user-story-chapters',
  templateUrl: './user-story-chapters.component.html'
})
export class UserStoryChaptersComponent implements OnInit {

  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  action: string;
  page: Page = { pageNumber: 0, pageSize: 5 } as Page;

  columns = [
    { name: 'Chapname', prop: 'chapname', sortTable: true },
    { name: 'Postdata', sortTable: true },
    { name: 'Coin', sortTable: true },
    { name: 'Chapstatus', sortTable: true },
  ];

  chapters: StoriesChapter[] = [];
  chapter: StoriesChapter = { id: 0 } as StoriesChapter;
  id: string;

  form: FormGroup;

  constructor(
    private chapterService: StoryChaptersService,
    private pnotifyService: PnotifyService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      chapname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      postdata: ['', Validators.required],
      coin: ['', Validators.required],
      chapstatus: ['', Validators.required],
      storyid: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadChapters();
  }

  // modals
  hideModal() {
    this.editModal.hide();
  }

  // show modal
  openAdd() {
    this.action = 'Add';
    this.chapter = { id: 0 } as StoriesChapter;
    this.editModal.show();
  }

  openEdit(id) {
    event.preventDefault();
    this.action = 'Edit';
    // load data here by id, then show dialog
    this.chapterService.get(id).subscribe(res => {
      this.chapter = res.data;
      this.editModal.show();
    });
  }

  loadChapters(page = null) {
    if (page != null) {
      this.page.pageNumber = page.offset;
    }
    this.chapterService.listByStoryId(this.id, this.page).subscribe(res => {
      this.page = res.pageInfo;
      this.chapters = res.data;
    });
  }

  // save
  save() {
    this.chapter.storyid = +this.id;
    this.chapterService.save(this.chapter).subscribe(res => {
      if (res.errorCode === 0) {
        this.editModal.hide();
        this.loadChapters();
        this.chapter = {} as StoriesChapter;
        this.pnotifyService.success('Info', this.action + ' susessfully');
      } else {
        this.editModal.hide();
        this.loadChapters();
        this.chapter = {} as StoriesChapter;
        this.pnotifyService.success('Info', this.action + ' susessfully');
      }
    }, err => {
      this.pnotifyService.error('Info', this.action + ' failed');
    });
  }

  // delete
  delete(id) {
    event.preventDefault();
    this.pnotifyService.showConfirm('Warnning', 'Are you sure?', yes => {
      if (yes) {
        this.chapterService.delete(id).subscribe(res => {
          if (res.errorCode === 0) {
            this.pnotifyService.success('Info', 'Delete succesfully');

          } else {
            if (res.errorCode === 200) {
              this.pnotifyService.error('Info', 'Delete failed. Data is associated with other objects.');
            } else {
              this.pnotifyService.success('Info', 'Delete succesfully');
            }
          }
          this.loadChapters();
        });
      }
    });
  }
}
