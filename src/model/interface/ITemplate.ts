import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";
import DTemplate from "./DTemplate";

export default interface ITemplate extends Identifiable, Treatable<DTemplate> {}
