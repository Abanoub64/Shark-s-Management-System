import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { QueueItem, QueueStatus } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private queueSubject = new BehaviorSubject<QueueItem[]>([]);
  queue$ = this.queueSubject.asObservable();

  private ticketCounter = 1000;

  constructor() {
    // Initialize with some mock queue items
    this.initializeMockQueue();
  }

  private initializeMockQueue(): void {
    const mockQueue: QueueItem[] = [
      {
        id: '1',
        ticketNumber: 'A001',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        branchId: '1',
        serviceId: '1',
        barberId: '1',
        status: QueueStatus.IN_SERVICE,
        estimatedWaitTime: 0,
        joinedAt: new Date(Date.now() - 15 * 60 * 1000),
        calledAt: new Date(Date.now() - 10 * 60 * 1000),
        startedAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: '2',
        ticketNumber: 'A002',
        customerName: 'Jane Smith',
        customerPhone: '+1234567891',
        branchId: '1',
        serviceId: '2',
        status: QueueStatus.WAITING,
        estimatedWaitTime: 15,
        joinedAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: '3',
        ticketNumber: 'A003',
        customerName: 'Bob Johnson',
        customerPhone: '+1234567892',
        branchId: '1',
        serviceId: '1',
        status: QueueStatus.WAITING,
        estimatedWaitTime: 30,
        joinedAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ];

    this.queueSubject.next(mockQueue);
  }

  getQueue(branchId: string): Observable<QueueItem[]> {
    return this.queue$.pipe(map((queue) => queue.filter((item) => item.branchId === branchId)));
  }

  addToQueue(
    item: Omit<QueueItem, 'id' | 'ticketNumber' | 'joinedAt' | 'estimatedWaitTime'>
  ): Observable<QueueItem> {
    const ticketNumber = `A${String(++this.ticketCounter).padStart(3, '0')}`;
    const currentQueue = this.queueSubject.value;

    // Calculate estimated wait time based on queue length
    const waitingInQueue = currentQueue.filter(
      (q) => q.branchId === item.branchId && q.status === QueueStatus.WAITING
    ).length;
    const estimatedWaitTime = waitingInQueue * 25; // 25 minutes per person

    const newItem: QueueItem = {
      ...item,
      id: Date.now().toString(),
      ticketNumber,
      joinedAt: new Date(),
      estimatedWaitTime,
    };

    this.queueSubject.next([...currentQueue, newItem]);
    return of(newItem).pipe(delay(200));
  }

  callNext(branchId: string, barberId?: string): Observable<QueueItem | null> {
    const currentQueue = this.queueSubject.value;

    // Find next waiting customer
    const nextCustomer = currentQueue.find(
      (item) => item.branchId === branchId && item.status === QueueStatus.WAITING
    );

    if (!nextCustomer) {
      return of(null);
    }

    // Update status to CALLED
    const updatedQueue = currentQueue.map((item) =>
      item.id === nextCustomer.id
        ? {
            ...item,
            status: QueueStatus.CALLED,
            calledAt: new Date(),
            barberId: barberId || item.barberId,
          }
        : item
    );

    this.queueSubject.next(updatedQueue);
    return of(nextCustomer).pipe(delay(200));
  }

  startService(itemId: string): Observable<QueueItem> {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: QueueStatus.IN_SERVICE,
            startedAt: new Date(),
            estimatedWaitTime: 0,
          }
        : item
    );

    this.queueSubject.next(updatedQueue);
    const updatedItem = updatedQueue.find((item) => item.id === itemId)!;
    return of(updatedItem).pipe(delay(200));
  }

  completeService(itemId: string): Observable<QueueItem> {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: QueueStatus.COMPLETED,
            completedAt: new Date(),
          }
        : item
    );

    this.queueSubject.next(updatedQueue);

    // Update wait times for remaining customers
    this.updateWaitTimes(itemId);

    const completedItem = updatedQueue.find((item) => item.id === itemId)!;
    return of(completedItem).pipe(delay(200));
  }

  skipCustomer(itemId: string): Observable<QueueItem> {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.map((item) =>
      item.id === itemId ? { ...item, status: QueueStatus.SKIPPED } : item
    );

    this.queueSubject.next(updatedQueue);
    this.updateWaitTimes(itemId);

    const skippedItem = updatedQueue.find((item) => item.id === itemId)!;
    return of(skippedItem).pipe(delay(200));
  }

  cancelQueueItem(itemId: string): Observable<void> {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.map((item) =>
      item.id === itemId ? { ...item, status: QueueStatus.CANCELLED } : item
    );

    this.queueSubject.next(updatedQueue);
    this.updateWaitTimes(itemId);

    return of(void 0).pipe(delay(200));
  }

  getQueueStatus(ticketNumber: string): Observable<QueueItem | null> {
    const currentQueue = this.queueSubject.value;
    const item = currentQueue.find((q) => q.ticketNumber === ticketNumber);
    return of(item || null).pipe(delay(200));
  }

  getQueueLength(branchId: string): Observable<number> {
    return this.queue$.pipe(
      map(
        (queue) =>
          queue.filter((item) => item.branchId === branchId && item.status === QueueStatus.WAITING)
            .length
      )
    );
  }

  getAverageWaitTime(branchId: string): Observable<number> {
    return this.queue$.pipe(
      map((queue) => {
        const waitingCustomers = queue.filter(
          (item) => item.branchId === branchId && item.status === QueueStatus.WAITING
        );

        if (waitingCustomers.length === 0) return 0;

        const totalWaitTime = waitingCustomers.reduce(
          (sum, item) => sum + item.estimatedWaitTime,
          0
        );

        return Math.round(totalWaitTime / waitingCustomers.length);
      })
    );
  }

  private updateWaitTimes(completedItemId: string): void {
    const currentQueue = this.queueSubject.value;
    const updatedQueue = currentQueue.map((item) => {
      if (item.status === QueueStatus.WAITING && item.estimatedWaitTime > 0) {
        return {
          ...item,
          estimatedWaitTime: Math.max(0, item.estimatedWaitTime - 25),
        };
      }
      return item;
    });

    this.queueSubject.next(updatedQueue);
  }

  // Get current serving customer
  getCurrentServing(branchId: string): Observable<QueueItem | null> {
    return this.queue$.pipe(
      map(
        (queue) =>
          queue.find(
            (item) => item.branchId === branchId && item.status === QueueStatus.IN_SERVICE
          ) || null
      )
    );
  }

  // Get next customers in queue
  getNextInQueue(branchId: string, count: number = 5): Observable<QueueItem[]> {
    return this.queue$.pipe(
      map((queue) =>
        queue
          .filter((item) => item.branchId === branchId && item.status === QueueStatus.WAITING)
          .slice(0, count)
      )
    );
  }
}
