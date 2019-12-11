import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoriesChapter } from 'src/app/models/stories-chapter';
import { Story } from 'src/app/models/story';
import { StoryChaptersService } from 'src/app/services/story-chapters.service';
import { StoriesService } from 'src/app/services/stories.service';
import { Page } from 'src/app/models/page';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.css']
})
export class StoryDetailComponent implements OnInit {
  story: Story;
  storyChapters: [StoriesChapter];

  page: Page = { pageNumber: 0, pageSize: 5 } as Page;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storiesService: StoriesService,
    private storyChaptersService: StoryChaptersService
  ) {

  }

  ngOnInit() {
    const stotyId: number = Number(this.route.snapshot.paramMap.get('id'));

    this.storiesService.get(stotyId).subscribe(res => {
      this.story = res.data;
    });

    this.storyChaptersService.listByStoryId(stotyId, this.page).subscribe(res => {
      this.storyChapters = res.data;
    });

  }

}
