/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-import-module-exports
const os = require('os');
const util = require('util');
const cp = require('child_process');
const disk = require('diskusage');

const { convertBytesToMB, convertToPercent, convertBytesToKB } = require('../config/utils');
const {
  responseCodes,
  osBasePath,
  operatingSystem,
  memoryUnit,
} = require('../config/constant');

const representableProcessData = (processes) => processes.map((process) => ({
  // there are other fields as well but they have been removed the fasten the output
  pid: process.pid,
  name: process.name,
}));

const convert512ByteBlockToMB = (data) => {
  const dataInKB = data / 2;
  // using this function as KB divided by 1024 returns MB
  return convertBytesToKB(dataInKB);
};

const representableDriveData = (drives) => drives.map((drive) => ({
  // Size in df's results are inclusive of the 5% reserved space
  total_space: convert512ByteBlockToMB(drive['512-blocks']),
  used_space: {
    used_space_in_unit: `${convert512ByteBlockToMB(drive.Used)} ${memoryUnit.MB}`,
    used_space_percent: `${convertToPercent(convert512ByteBlockToMB(drive.Used), convert512ByteBlockToMB(drive['512-blocks']))} %`,
  },
  free_space: {
    free_space_in_unit: `${convert512ByteBlockToMB(drive.Available)} ${memoryUnit.MB}`,
    free_space_in_percent: `${convertToPercent(convert512ByteBlockToMB(drive.Available), convert512ByteBlockToMB(drive['512-blocks']))} %`,
  },
}));

const exec = util.promisify(cp.exec);

const getDriveDataWindows = async () => {
  try {
    const { stdout } = await exec('wmic logicaldisk get size,freespace,caption');
    const drives = stdout.trim().split('\r\r\n')
      .map((value) => value.trim().split(/\s+/))
      .slice(1);
    return drives;
  } catch (error) {
    return [];
  }
};

const getDriveDataOtherOS = async () => {
  try {
    const { stdout } = await exec('df');
    const rows = stdout.trim().split('\n');
    const columnNames = rows.shift().split(/\s+/);

    const data = rows.map((row) => {
      const values = row.split(/\s+/);
      const obj = {};
      for (let i = 0; i < columnNames.length; i += 1) {
        obj[columnNames[i]] = values[i];
      }
      return obj;
    });
    return data;
  } catch (error) {
    return [];
  }
};

const getResources = async (req, res) => {
  const path = os.platform() === operatingSystem.WINDOWS ? osBasePath.WINDOWS : osBasePath.OTHER;
  // Fetching Free RAM and Total RAM using os module
  try {
    // Fetching Free RAM and Total RAM using os module
    const freeMemoryInBytes = os.freemem();
    const osTotalMem = os.totalmem();
    const usedMemory = osTotalMem - freeMemoryInBytes;

    // Fetching Total hard disk space and free hard disk space using diskusuage npm module
    const {
      free: freeHDSpace,
      total: totalHDSpace,
    } = await disk.check(path);

    let driveDetails = [];
    //   Fetching Drive Data using child process and executing command to fetch drive details
    if (process.platform === operatingSystem.WINDOWS) {
      driveDetails = await getDriveDataWindows();
    } else {
      driveDetails = await getDriveDataOtherOS();
    }

    const driveData = representableDriveData(driveDetails, totalHDSpace);

    //   Fetching Processes data using ps-list npm package
    const psList = await import('ps-list');
    const processes = await psList.default();

    const result = {
      RAM: {
        total_memory: `${convertBytesToMB(osTotalMem)} ${memoryUnit.MB}`,
        free_memory: {
          free_memory_in_unit: `${convertBytesToMB(freeMemoryInBytes)} ${memoryUnit.MB}`,
          free_memory_in_percent: `${convertToPercent(freeMemoryInBytes, osTotalMem)} %`,
        },
        used_memory: {
          used_memory_in_unit: `${convertBytesToMB(usedMemory)} ${memoryUnit.MB}`,
          used_memory_in_percent: `${100 - convertToPercent(freeMemoryInBytes, osTotalMem)} %`,
        },
      },
      HDD: {
        total_space: convertBytesToMB(totalHDSpace),
        free_space: {
          free_space_in_unit: `${convertBytesToMB(freeHDSpace)} ${memoryUnit.MB}`,
          free_space_percent: `${convertToPercent(freeHDSpace, totalHDSpace)} %`,
        },
        used_space: {
          used_space_in_unit: `${convertBytesToMB(totalHDSpace - freeHDSpace)} ${memoryUnit.MB}`,
          used_space_percent: `${100 - convertToPercent(freeHDSpace, totalHDSpace)} %`,
        },
        drive_data: driveData,
      },
      Service: representableProcessData(processes),
      currentTime: new Date(),
    };
    return res.status(responseCodes.SUCESS).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error found while fetching Resource details ${JSON.stringify(error)}`);
    return {
      error,
    };
  }
};

module.exports = { getResources };
