<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class CopyRedirect extends Vue {
  public mounted(): void {
    const journalId = this.$route.params.journalId;
    if (!journalId) {
      this.$router.push("/journalize");
      return;
    }
    this.$router.push(`/journalize/copy/${journalId}`);
  }
}
</script>
