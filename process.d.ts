// 添加全局环境变量TS类型
declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv extends Dict<string> {
        INFURA_API_KEY: string;
        ETHERSCAN_API_KEY: string;
        DEPLOYER_PRIVKEY: string;
        CONTRACT_MATH_LIBRARY_ADDRESS: string;
        CONTRACT_XEN_TOKEN_ADDRESS: string;
      }
    }
  }
}
