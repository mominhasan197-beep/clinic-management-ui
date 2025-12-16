import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private dom: Document
    ) { }

    updateTitle(title: string) {
        this.titleService.setTitle(title);
    }

    updateMetaTags(tags: { name: string, content: string }[]) {
        tags.forEach(tag => {
            this.metaService.updateTag({ name: tag.name, content: tag.content });
        });
    }

    setCanonicalURL(url?: string) {
        let canURL = url == undefined ? this.dom.URL : url;
        let link: HTMLLinkElement = this.dom.querySelector('link[rel="canonical"]') || this.dom.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.dom.head.appendChild(link);
        link.setAttribute('href', canURL);
    }
}
