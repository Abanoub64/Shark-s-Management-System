import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LightXService } from './lightx.service';

describe('LightXService', () => {
    let service: LightXService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LightXService]
        });
        service = TestBed.inject(LightXService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate hairstyle successfully', (done) => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const mockPrompt = 'test prompt';
        const mockUploadUrl = 'https://upload.url';
        const mockImageUrl = 'https://image.url';
        const mockOrderId = 'order-123';
        const mockResultUrl = 'https://result.url';

        service.generateHairstyle(mockFile, mockPrompt).subscribe(url => {
            expect(url).toBe(mockResultUrl);
            done();
        });

        // 1. Get Upload URL
        const uploadReq = httpMock.expectOne('/api/lightx/v2/uploadImageUrl');
        expect(uploadReq.request.method).toBe('POST');
        uploadReq.flush({
            statusCode: 2000,
            message: 'Success',
            body: { uploadImage: mockUploadUrl, imageUrl: mockImageUrl }
        });

        // 2. Upload Image
        const putReq = httpMock.expectOne(mockUploadUrl);
        expect(putReq.request.method).toBe('PUT');
        putReq.flush({});

        // 3. Initiate Generation
        const genReq = httpMock.expectOne('/api/lightx/v1/hairstyle');
        expect(genReq.request.method).toBe('POST');
        expect(genReq.request.body.imageUrl).toBe(mockImageUrl);
        genReq.flush({
            statusCode: 2000,
            message: 'Success',
            body: { orderId: mockOrderId }
        });

        // 4. Poll Status
        const pollReq = httpMock.expectOne('/api/lightx/v1/order-status');
        expect(pollReq.request.method).toBe('POST');
        pollReq.flush({
            statusCode: 2000,
            message: 'Success',
            body: { status: 'active', output: mockResultUrl }
        });
    });
});
