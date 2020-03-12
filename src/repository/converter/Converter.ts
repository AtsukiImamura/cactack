import Strable from "../../model/interface/common/Strable";
import Treatable from "../../model/interface/common/Treatable";

export default abstract class Converter<
  S extends Strable,
  T extends Treatable
> {
  public abstract convert(value: S): Promise<T>;
}
