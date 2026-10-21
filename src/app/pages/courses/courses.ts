import { Component, inject, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses-service';

@Component({
  selector: 'app-courses',
  imports: [],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {

  coursesService = inject(CoursesService);

  ngOnInit() {
    this.coursesService.fetchCourses();
  }

}
