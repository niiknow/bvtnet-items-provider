import browserEnv from 'browser-env';
import MockWebStorage from 'mock-webstorage';
browserEnv(['window', 'document', 'navigator']);

global.localStorage = new MockWebStorage();
global.sessionStorage = new MockWebStorage();
Object.defineProperty(window, 'localStorage', { value: global.localStorage,configurable:true,enumerable:true,writable:true });
Object.defineProperty(window, 'sessionStorage', { value: global.sessionStorage,configurable:true,enumerable:true,writable:true });
