import Transformer from "@/repository/transformer/Transformer";

import { singleton } from "tsyringe";
import DTemplate from "@/model/interface/DTemplate";
import ITemplate from "@/model/interface/ITemplate";
import UserTemplate from "@/model/UserTemplate";

@singleton()
export default class TemplateTransformer extends Transformer<
  DTemplate,
  ITemplate
> {
  public async aggregate(template: DTemplate): Promise<ITemplate> {
    return UserTemplate.parse(template);
  }
}
