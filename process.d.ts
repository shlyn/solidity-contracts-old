// 添加全局环境变量TS类型
declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv extends Dict<string> {
        MAINNET_OR_TEST: "TEST" | "MAINNET";
        DEPLOYER_PRIVEKEY: string;
        TEST_PRIVEKEY: string;

        API_KEY_INFURA: string;
        API_KEY_ETHERESCAN: string;
        API_KEY_: string;

        URL_INFURA: string;
        URL_: string;
      }
    }
  }
}
