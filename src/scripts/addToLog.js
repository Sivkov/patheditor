import logStore  from "./../components/stores/logStore"; // Импорт logStore
import svgStore  from "./../components/stores/svgStore"; // Импорт svgStore
import log from './log'

export const addToLog = (message) => {
    let now = new Date().getTime();
    logStore.add({ time: now, action: message });
    let data = {
        id: now,
        svg: JSON.stringify(svgStore.svgData),
    };
    log.save(data);
};