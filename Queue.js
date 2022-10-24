


class Queue {

   add(task) {

      if (typeof task !== "function") {
         throw new Error('Task should be a function');
      }

      this._list.push(task);

      if (!this._queueRunning)
         this._run();
   }

   async _run() {
      

      this._queueRunning = true;

      const task = this._list.shift();

      if (!task) {
         this._queueRunning = false;
         return;
      }

      await task();
      this._run();

   }

   constructor() {   
      this._list = [];
      this._queueRunning = false;
   }
}


module.exports = Queue;