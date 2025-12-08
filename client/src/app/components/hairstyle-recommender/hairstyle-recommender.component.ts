import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightXService } from '../../core/services/lightx.service';
import { LanguageService } from '../../core/services/language.service';

interface HairTypeOption {
    id: number;
    label: string;
    arabicLabel: string; // Added for UI localization
    prompt: string;
    description: string;
    recommendation: string;
    arabicRecommendation: string;
}

@Component({
    selector: 'app-hairstyle-recommender',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hairstyle-recommender.component.html',
})
export class HairstyleRecommenderComponent {
    private lightXService = inject(LightXService);
    public langService = inject(LanguageService);
    t = this.langService.t;

    // Signals
    generatedImageUrl = signal<string | null>(null);
    previewUrl = signal<string | null>(null);
    isLoading = signal<boolean>(false);
    error = signal<string | null>(null);
    selectedHairType = signal<number>(1);

    // State variables
    isDragging = false;
    selectedFile: File | null = null;

    // Base prompt instructions to ensure realism across all styles
    // This instructs the AI to behave like a camera and a barber, preserving the face ID.
    private readonly baseRealismPrompt = 'Hyper-realistic 8k portrait, professional barbershop photography, sharp focus, natural skin texture, preserve facial features and identity, seamless blending of hair and scalp, cinematic lighting.';

    hairTypes: HairTypeOption[] = [
        {
            id: 1,
            label: 'Textured French Crop',
            arabicLabel: 'فرينش كروب (القصر العشوائي)',
            prompt: `${this.baseRealismPrompt} Men's French Crop hairstyle. High skin fade on the sides and back. The top is textured, choppy, and directed forward with a short fringe across the forehead. Matte finish styling product look. Suitable for the subject's face shape.`,
            description: 'Short sides, textured top with fringe.',
            recommendation: 'Ask the barber for a "High Skin Fade" on the sides and a "Textured Crop" on top. Use matte wax or styling powder to create the messy texture.',
            arabicRecommendation: 'اطلب من الحلاق "High Skin Fade" (تدريجة عالية) من الجوانب و "Textured Crop" من الأعلى. استخدم شمع غير لامع (Matte Wax) أو بودرة تصفيف للحصول على المظهر الفوضوي.'
        },
        {
            id: 2,
            label: 'Classic Taper Fade',
            arabicLabel: 'التدريجة الكلاسيك (Taper)',
            prompt: `${this.baseRealismPrompt} Classic Taper Fade hairstyle. Clean, sharp geometric hairline (line-up). The fade starts low around the ears and neck, blending smoothly into longer hair on top. Neat, professional, groomed look. Side part hint.`,
            description: 'Clean edges, professional gradient.',
            recommendation: 'Request a "Low Taper Fade" with a sharp line-up (C-Cup). Keep the top long enough to comb back or to the side. This is the go-to professional cut in Egypt.',
            arabicRecommendation: 'اطلب "Low Taper Fade" مع تحديد حاد (C-Cup). اترك الشعر من الأعلى طويلاً بما يكفي لتمشيطه للخلف أو للجانب. هذه هي القصة الكلاسيكية المفضلة للمحترفين في مصر.'
        },
        {
            id: 3,
            label: 'Curly Top with Temple Fade',
            arabicLabel: 'كيرلي مع تدريجة (The Broccoli)',
            prompt: `${this.baseRealismPrompt} Modern Curly hairstyle with Temple Fade. Sides are faded down (drop fade). The top creates a voluminous silhouette with defined natural curls or twists. Sharp hairline edges. Youthful and trendy aesthetic.`,
            description: 'Volume on top, faded sides for contrast.',
            recommendation: 'Ask for a "Drop Fade" or "Temple Fade". Tell the barber to use a curl sponge on the top and define the curls with curling cream. Keep the volume high.',
            arabicRecommendation: 'اطلب "Drop Fade" أو "Temple Fade". اطلب من الحلاق استخدام إسفنجة الكيرلي (Curl Sponge) من الأعلى وتحديد الخصلات باستخدام كريم الكيرلي. حافظ على كثافة الشعر عالية.'
        },
        {
            id: 4,
            label: 'Buzz Cut with Line-up',
            arabicLabel: 'ع الزيرو (الميري / 1)',
            prompt: `${this.baseRealismPrompt} Buzz Cut hairstyle. Very short uniform length (guard #1 or #2). Extremely sharp, geometric box hairline on the forehead. Masculine, rugged look. Highlights the facial bone structure.`,
            description: 'Uniform short length, low maintenance.',
            recommendation: 'Ask for a "Number 1 or 2 all over". The secret here is the "Tahdeed" (Line-up). Even if the hair is short, the forehead line must be razor sharp.',
            arabicRecommendation: 'اطلب "رقم 1 أو 2" للشعر بالكامل. السر هنا يكمن في "التحديد". حتى لو كان الشعر قصيراً، يجب أن يكون خط الجبهة حاداً جداً.'
        },
        {
            id: 5,
            label: 'Modern Quiff / Pompadour',
            arabicLabel: 'السبايكي المودرن (Quiff)',
            prompt: `${this.baseRealismPrompt} Modern Quiff hairstyle. Short faded sides (mid-fade). The hair on top is long and blow-dried upwards and backwards with volume. textured and airy look, not greasy. sophisticated and stylish.`,
            description: 'Voluminous front, brushed back/up.',
            recommendation: 'Ask for a "Mid Fade". For the top, request a "Quiff" using a blow dryer and a round brush to get that volume. Finish with strong-hold hairspray.',
            arabicRecommendation: 'اطلب "Mid Fade". بالنسبة للأعلى، اطلب تسريحة "Quiff" (السبايكي المودرن) باستخدام السشوار والفرشاة الدائرية للحصول على الكثافة. ثبت الشعر بمثبت قوي (Hairspray).'
        }
    ];

    get currentRecommendation(): string {
        const type = this.hairTypes.find(t => t.id === this.selectedHairType());
        if (!type) return '';
        return this.langService.currentLang() === 'ar' ? type.arabicRecommendation : type.recommendation;
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.processFile(input.files[0]);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
        if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
            this.processFile(event.dataTransfer.files[0]);
        }
    }

    private processFile(file: File) {
        if (!file.type.startsWith('image/')) {
            this.error.set(this.t().validImageError);
            return;
        }

        this.selectedFile = file;
        this.error.set(null);
        this.generatedImageUrl.set(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewUrl.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }

    selectHairType(id: number) {
        this.selectedHairType.set(id);
    }

    generateHairstyle() {
        if (!this.selectedFile) {
            this.error.set(this.t().uploadFirstError);
            return;
        }

        const selectedType = this.hairTypes.find(t => t.id === this.selectedHairType());
        if (!selectedType) return;

        this.isLoading.set(true);
        this.error.set(null);

        // Call service
        this.lightXService.generateHairstyle(this.selectedFile, selectedType.prompt)
            .subscribe({
                next: (imageUrl) => {
                    this.generatedImageUrl.set(imageUrl);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error(err);
                    this.error.set(this.t().failedToGenerate || 'Failed to generate hairstyle');
                    this.isLoading.set(false);
                }
            });
    }
}
