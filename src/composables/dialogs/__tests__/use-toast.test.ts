import { feedbackColorToVuetifyColor } from "@/composables/colors/constants.ts";
import type { FeedbackColorVariant, FeedbackVuetifyColor } from "@/composables/colors/types.ts";
import type { ToastMessage } from "@/composables/dialogs/types.ts";
import useToast, { messages } from "@/composables/dialogs/use-toast.ts";
import { icons } from "@/consts/icons.ts";

const colors = Object.entries(feedbackColorToVuetifyColor) as [
  FeedbackColorVariant,
  FeedbackVuetifyColor,
][];

describe("useToast", () => {
  const { toast } = useToast();

  beforeEach(() => (messages.value = []));

  describe("toast", () => {
    it("should be able to add messages", () => {
      const message = "In the jungle you must wait, until the dice read five or eight.";

      expect(messages.value).toHaveLength(0);
      toast({ message });

      expect(messages.value).toHaveLength(1);
      expect(messages.value[0]).toEqual(expect.objectContaining({ text: message }));
    });

    describe("color", () => {
      it.each(colors)(
        'should forward `color="%s"` to Vuetify\'s `%s` color',
        async (color, vuetifyColor) => {
          const message = "Message 1";
          const toastMessage: ToastMessage = {
            text: message,
            color: vuetifyColor,
            prependIcon: icons[vuetifyColor],
            timerColor: `rgb(var(--v-theme-on-${vuetifyColor}))`,
          };

          toast({ message, color });
          expect(messages.value).toHaveLength(1);
          expect(messages.value[0]).toEqual(toastMessage);
        },
      );

      it("should toast as info by default", () => {
        const message = "Message 1";

        toast({ message });
        expect(messages.value).toHaveLength(1);
        expect(messages.value[0]).toEqual(
          expect.objectContaining({ text: message, color: "info" }),
        );
      });
    });
  });
});
