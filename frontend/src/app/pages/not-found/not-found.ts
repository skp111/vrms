import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="card text-center" style="max-width: 500px; margin: 5rem auto; padding: 3rem;">
        <h1 style="font-size: 4rem; color: var(--danger); margin-bottom: 1rem;">404</h1>
        <h2 style="margin-bottom: 1rem;">Page Not Found</h2>
        <p class="text-secondary" style="margin-bottom: 2rem;">
          The page you are looking for doesn't exist, has been moved, or you don't have permission to view it.
        </p>
        <a routerLink="/" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `
})
export class NotFound {}
