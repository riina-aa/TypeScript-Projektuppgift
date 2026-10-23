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
  currentPage = signal(1);
  pageSize = 50;

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

  //Sorterar kurser
  sortCourses(column: "courseCode" | "courseName" | "points" | "subject") {

    if (this.sortTable() === column) {
      this.sortDirection.update(direction => direction === "asc" ? "desc" : "asc");

    } else {
      this.sortTable.set(column);
      this.sortDirection.set("asc");
    }
  }

  //Lägger till kurser i ramschema
  toggleCourse(course: CourseWithId): void {
    const isSelected = this.scheduleService.isCourseSelected(course.id); 

    if (isSelected) {
      this.scheduleService.removeCourse(course.id); 
    } else {
      this.scheduleService.addCourse(course);
    }
  }

  //Sköter paginering
  paginatedCourses = computed(() => {
    const courses = this.sortedCourses();
    const start = (this.currentPage() - 1) * this.pageSize;

    return courses.slice(start, start + this.pageSize);
  })

  //Räknar ut totala antal sidor 
  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.sortedCourses().length / this.pageSize))
  });

  //Ändra till nästa sida
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  //Ändra till föregående sida
  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  updateSubject(value: string): void {
    this.selectedSubject.set(value);
    this.currentPage.set(1);
  }

  updateLevel(value: string): void {
    this.selectedLevel.set(value);
    this.currentPage.set(1);
  }

}
