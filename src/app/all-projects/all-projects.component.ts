import { Component, OnInit, AfterViewInit } from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit {
  projects = [
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Corporate Identity',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Web Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Print Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
    {
      title: 'Project title',
      category: 'Packaging Design',
      description: 'Project descrption',
      image: 'assets/all-projects/aalekhan.jpeg'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  
  ngAfterViewInit(): void {
    this.initTilt();
  }

  initTilt(): void {
    VanillaTilt.init(Array.from(document.querySelectorAll("[data-tilt]")) as HTMLElement[], {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });
  }

  
  onMouseMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  onMouseLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  }
}
