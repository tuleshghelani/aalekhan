import { Injectable } from '@angular/core';

export interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  allImages: string[];
  mainDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    {
      title: 'Kadhai',
      category: 'Packaging Design',
      description: 'Let us help you create a cohesive brand identity that speaks to your target market and drives your business forward.',
      mainDescription: 'At aalekhan branding, we believe that powerful design is the heart of great branding. Our custom packaging and logo designs are crafted to tell your brand’s unique story, captivate your audience, and elevate your product',
      image: 'assets/all-projects/KADHAI_POST_1.jpg',
      allImages: ['assets/all-projects/KADHAI_POST_1.jpg', 'assets/all-projects/KADHAI_POST_2.jpg', 'assets/all-projects/KADHAI_POST_3.jpg',
        'assets/all-projects/KADHAI_POST_4.jpg', 'assets/all-projects/KADHAI_POST_5.jpg', 'assets/all-projects/KADHAI_POST_6.jpg', 
        'assets/all-projects/KADHAI_POST_7.jpg'
      ]
    },
    {
      title: 'Florena',
      category: 'Label and sticker',
      description: 'Let us help you create a cohesive brand identity that speaks to your target market and drives your business forward.',
      mainDescription: 'At aalekhan branding, we believe that powerful design is the heart of great branding. Our custom packaging and logo designs are crafted to tell your brand’s unique story, captivate your audience, and elevate your product',
      image: 'assets/all-projects/florena_post_1.jpg',
      allImages: ['assets/all-projects/florena_post_1.jpg', 'assets/all-projects/florena_post_2.jpg', 'assets/all-projects/florena_post_3.jpg'
      ]
    },
    {
      title: 'Project title',
      category: 'Corporate Identity',
      description: 'Project description',
      image: 'assets/all-projects/aalekhan.jpeg',
      allImages: ['assets/all-projects/aalekhan.jpeg', 'assets/all-projects/aalekhan2.jpeg']
    },
    {
      title: 'Project title',
      category: 'Corporate Identity',
      description: 'Project description',
      image: 'assets/all-projects/aalekhan.jpeg',
      allImages: ['assets/all-projects/aalekhan.jpeg', 'assets/all-projects/aalekhan2.jpeg']
    },
    // ... Add the rest of your projects here with the allImages field
  ];

  constructor() { }

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectByTitle(title: string): Project | undefined {
    return this.projects.find(project => project.title === title);
  }
}