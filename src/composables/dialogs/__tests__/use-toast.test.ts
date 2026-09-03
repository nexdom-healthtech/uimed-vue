import type { ColorVariant } from "@/composables/colors/types.ts";
import type { ToastMessage } from "@/composables/dialogs/types.ts";
import useToast, { messages } from "@/composables/dialogs/use-toast.ts";

describe("useToast", () => {
  const { toast, dismiss: dismissAll } = useToast();

  beforeEach(dismissAll);

  describe("toast", () => {
    it("should be able to add and dismiss messages", () => {
      const message = "In the jungle you must wait, until the dice read five or eight.";

      expect(messages.value).toHaveLength(0);
      const dismiss = toast({ message });

      expect(messages.value).toHaveLength(1);
      expect(messages.value[0]).toEqual(expect.objectContaining({ message }));

      dismiss();
      expect(messages.value).toHaveLength(0);
    });

    it("should dismiss message only once", () => {
      const message1 = "Every month at the quarter moon, there'll be a monsoon in your lagoon.";
      const message2 = "They grow much faster than bamboo. take care or they'll come after you.";

      toast({ message: message1 });
      const dismissMessage2 = toast({ message: message2 });

      expect(messages.value).toHaveLength(2);
      expect(messages.value[0]).toEqual(expect.objectContaining({ message: message1 }));
      expect(messages.value[1]).toEqual(expect.objectContaining({ message: message2 }));

      dismissMessage2();
      dismissMessage2();
      expect(messages.value).toHaveLength(1);
      expect(messages.value[0]).toEqual(expect.objectContaining({ message: message1 }));
    });

    it("should dismiss expected message only", () => {
      const message1 = "There is a lesson you will learn: sometimes you must go back a turn.";
      const message2 =
        "You're almost there with much at stake, but now the ground begins to quake.";

      const dismissMessage1 = toast({ message: message1 });
      const dismissMessage2 = toast({ message: message2 });

      expect(messages.value).toHaveLength(2);
      expect(messages.value[0]).toEqual(expect.objectContaining({ message: message1 }));
      expect(messages.value[1]).toEqual(expect.objectContaining({ message: message2 }));

      dismissMessage2();
      expect(messages.value).toHaveLength(1);
      expect(messages.value[0]).toEqual(expect.objectContaining({ message: message1 }));

      dismissMessage1();
      expect(messages.value).toHaveLength(0);
    });

    describe("color", () => {
      it("should toast as info by default", () => {
        const message = "Message 1";

        toast({ message });
        expect(messages.value).toHaveLength(1);
        expect(messages.value[0]).toEqual(
          expect.objectContaining({ message, color: "informative" }),
        );
      });

      it("should be able to toast different colors", () => {
        const message = "Message 1";
        const color: ColorVariant = "positive";
        const toastMessage: ToastMessage = { message, color };

        toast(toastMessage);
        expect(messages.value).toHaveLength(1);
        expect(messages.value[0]).toEqual(toastMessage);
      });
    });
  });

  describe("dismiss", () => {
    it("should dismiss all messages", () => {
      expect(messages.value).toHaveLength(0);

      toast({ message: "Message 1" });
      toast({ message: "Message 2" });
      toast({ message: "Message 3" });
      expect(messages.value).toHaveLength(3);

      dismissAll();
      expect(messages.value).toHaveLength(0);
    });
  });
});
