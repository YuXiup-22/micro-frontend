import type { MicroAppInitData } from "../bus/container/type";
import { CreateContainer } from "../CreateContainer/index";
import { type ContainerDomRefs } from "../CreateContainer/Container";
export const CreateMicroApp = async (
  props?: MicroAppInitData
): Promise<ContainerDomRefs> => {
  if (!props) props = {};
  
  const mountRes = await CreateContainer({ type: "microApp", ...props });
  return mountRes;
};
