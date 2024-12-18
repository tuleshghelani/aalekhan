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
      title: 'NKC bearings LLP',
      category: 'Box, Advertising, Packaging, Branding',
      description: 'The right presentation doesn`t just present your product; it positions as the solution. At Aalekhan we specialize in brand creation that goes beyond logos, brochures and packaging. We make your business unique. That speaks to the people who matter most to your audience.',
      image: 'assets/all-projects/box.jpg',
      allImages: ['assets/all-projects/box.jpg', 'assets/all-projects/brochure_front.jpg'
        ,'assets/all-projects/brochure_inner_pages.jpg','assets/all-projects/letterhead_business_card.jpg',
        'assets/all-projects/roughpad.jpg','assets/all-projects/social_media.jpg'
      ]
    },
    {
      title: 'Pusti art',
      category: 'Logo',
      description: 'Showcases a new visual identity for Pushti art. We made this logo with the goal of designing a distinct, playful It’s the perfect tool to showcase creativity and professionalism.',
      image: 'assets/all-projects/pusti_art_01.jpg',
      allImages: ['assets/all-projects/pusti_art_01.jpg', 'assets/all-projects/pusti_art_02.jpg',
        'assets/all-projects/pusti_art_03.jpg', 'assets/all-projects/pusti_art_04.jpg',
        'assets/all-projects/pusti_art_05.jpg', 'assets/all-projects/pusti_art_06.jpg'
      ]
    },
    {
      title: 'Oracle',
      category: 'Logo',
      description: 'Demonstrated creativity, versatility and ability to create unique, user-centered designs.',
      image: 'assets/all-projects/oracle/ORACLE_SEEDS_POST_4.jpg',
      allImages: ['assets/all-projects/oracle/ORACLE_SEEDS_POST_4.jpg', 'assets/all-projects/oracle/ORACLE_POST_3.jpg','assets/all-projects/oracle/ORACLE_POST_1.jpg',
        'assets/all-projects/oracle/ORACLE_POST_2_SWIPE.jpg', 'assets/all-projects/oracle/ORACLE_POST_2.jpg', 'assets/all-projects/oracle/ORACLE_POST_6.jpg'
      ]
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