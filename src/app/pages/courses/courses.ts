import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CoursesService } from '../../services/courses-service';
import { ScheduleService } from '../../services/schedule-service';
import { CourseWithId } from '../../interfaces/courseInterface';

@Component({
  selector: 'app-courses',
  imports: [],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {

  coursesService = inject(CoursesService);
  scheduleService = inject(ScheduleService);

  sortTable = signal<"courseCode" | "courseName" | "points" | "subject">("courseCode");
  sortDirection = signal<"asc" | "desc">("asc");
  searchTerm = signal("");
  selectedSubject = signal("");
  selectedLevel = signal("");

  //Sorterar kurser
  sortedCourses = computed(() => {
    const courses = this.filteredCourses();
    const column = this.sortTable();
    const direction = this.sortDirection();

    return [...courses].sort((a, b) => {

      let comparison: number;

      if (column === "points") {
        comparison = a.points - b.points;
      } else {
        comparison = a[column].localeCompare(b[column], "sv");
      }

      return direction === "asc" ? comparison : -comparison;

    });
  });

  //Filtrerar kurserna 
  filteredCourses = computed(() => {
    const courses = this.coursesService.courses();
    const search = this.searchTerm().toLowerCase().trim();
    const subject = this.selectedSubject();
    const level = this.selectedLevel()

    console.log("Valt ämne:", JSON.stringify(subject));
    console.log("Vald nivå:", JSON.stringify(level));

    return courses.filter(course => {

      //Filtrerar på sökning
      const searchMatch =
        course.courseCode.toLowerCase().includes(search) ||
        course.courseName.toLowerCase().includes(search);

      //Filtrerar på ämne 
      const subjectMatch = !subject || course.subject === subject;

      //Filtrerar på nivå 
      const levelMatch = !level || course.level === level;

      return searchMatch && subjectMatch && levelMatch;
    });
  });

  //Hämtar endast kursämnet
  subjects = computed(() => {
    const courses = this.coursesService.courses();

    return [... new Set(courses.map(course => course.subject))].sort();
  });

  //Hämtar endast kursnivån
  levels = computed(() => {
    const courses = this.coursesService.courses();

    return [... new Set(courses.map(course => course.level))].sort();
  })

  ngOnInit() {
    this.coursesService.fetchCourses();
  }

  sortCourses(column: "courseCode" | "courseName" | "points" | "subject") {

    if (this.sortTable() === column) {
      this.sortDirection.update(direction => direction === "asc" ? "desc" : "asc");

    } else {
      this.sortTable.set(column);
      this.sortDirection.set("asc");
    }
  }

  addToSchedule(course: CourseWithId): void {
    this.scheduleService.addCourse(course);
  }

}
