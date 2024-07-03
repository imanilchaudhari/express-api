import os from 'os';
import { version } from '../../package.json';
import { Request, Response } from 'express';
import Logger from '../Helpers/Logger';

export class HealthController {

  getInMB = (data: number): number => {
    return Math.round(((data / 1024 / 1024) * 100) / 100);
  }

  getOsInfo = () => {
    return {
      uptime: os.uptime(),
      type: os.type(),
      release: os.release(),
      hostname: os.hostname(),
      arch: os.arch(),
      platform: os.platform(),
      user: this.getUserInfo()
    };
  }

  getClientInfo = () => {
    return {
      type: 'nodejs',
      version: version,
      langVersion: process.version
    };
  }

  getCpuInfo = () => {
    const cpus = os.cpus();
    const load = os.loadavg();
    const cpu = {
      load1: load[0],
      load5: load[1],
      load15: load[2],
      cores: Array.isArray(cpus) ? os.cpus().length : null
    };

    Object.assign(cpu, {
      utilization: Math.min(Math.floor(load[0] * 100 / cpu.cores!), 100)
    });

    return cpu;
  }

  getMemInfo = () => {
    try {
      const memoryUsage: number = this.getInMB(os.totalmem() - os.freemem());
      const totalMemory: number = this.getInMB(os.totalmem());
      const freeMemory: number = this.getInMB(os.freemem());
      const heapMemory: number = this.getInMB(process.memoryUsage().heapUsed);
      const heapTotal: number = this.getInMB(process.memoryUsage().heapTotal);
      return {
        usage: `${((memoryUsage / totalMemory) * 100).toFixed(2)} %`,
        free_memory: `${freeMemory} MB`,
        total_memory: `${totalMemory} MB`,
        heap_used: `${heapMemory} MB`,
        total_heap: `${heapTotal} MB`
      };
    } catch (err) {
      return `App error: ${err}`;
    }
  }

  getUserInfo = () => {
    try {
      return os.userInfo();
    } catch (e) {
      return {};
    }
  }

  getProcessInfo = () => {
    return {
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      argv: process.argv
    };
  }

  getDateTimeInfo = () => {
    return {
      now: Date.now(),
      iso: new Date().toISOString(),
      utc: new Date().toUTCString()
    };
  }

  healthCheck = async (req: Request, res: Response) => {
    try {
      const result = {
        success: true,
        message: {
          status: 'OK',
          os: this.getOsInfo(),
          cpu: this.getCpuInfo(),
          mem: this.getMemInfo(),
          process: this.getProcessInfo(),
          client: this.getClientInfo(),
          time: this.getDateTimeInfo()
        }
      };
      return res.status(200).json(result);
    } catch (error) {
      Logger.error('error', 'Health check failed. ' + error);
      return res.status(500).json({
        success: false,
        message: error
      });
    }
  }
}
