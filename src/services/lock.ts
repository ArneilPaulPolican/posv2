export class Lock {
    private promise: Promise<void> = Promise.resolve();
  
    public acquire(): Promise<void> {
      let release: () => void;
      const next = new Promise<void>((resolve) => {
        release = () => resolve();
      });
      const acquired = this.promise.then(() => release!());
      this.promise = next;
      return acquired;
    }
  
    public release(): void {
      // Resolve the current promise to release the lock
      this.promise = Promise.resolve();
    }
  }
  