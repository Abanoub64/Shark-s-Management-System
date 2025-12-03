import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HairstyleRecommenderComponent } from './hairstyle-recommender.component';
import { LightXService } from '../services/lightx.service';
import { of, throwError } from 'rxjs';

describe('HairstyleRecommenderComponent', () => {
    let component: HairstyleRecommenderComponent;
    let fixture: ComponentFixture<HairstyleRecommenderComponent>;
    let mockLightXService: jasmine.SpyObj<LightXService>;

    beforeEach(async () => {
        mockLightXService = jasmine.createSpyObj('LightXService', ['generateHairstyle']);

        await TestBed.configureTestingModule({
            imports: [HairstyleRecommenderComponent],
            providers: [
                { provide: LightXService, useValue: mockLightXService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HairstyleRecommenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default hair type selected', () => {
        expect(component.selectedHairType()).toBe(1);
    });

    it('should update selected hair type', () => {
        component.selectHairType(2);
        expect(component.selectedHairType()).toBe(2);
    });

    it('should show error if generating without file', () => {
        component.generateHairstyle();
        expect(component.error()).toBe('Please upload an image first.');
    });

    it('should call service with prompt on generate', () => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        // @ts-ignore: Accessing private property for testing
        component.selectedFile = mockFile;
        component.selectedHairType.set(1); // Buzz Cut

        mockLightXService.generateHairstyle.and.returnValue(of('https://result.url'));

        component.generateHairstyle();

        expect(mockLightXService.generateHairstyle).toHaveBeenCalledWith(mockFile, 'buzz cut hairstyle, very short uniform length, military style, sharp hairline, masculine look');
        expect(component.generatedImageUrl()).toBe('https://result.url');
    });
});
