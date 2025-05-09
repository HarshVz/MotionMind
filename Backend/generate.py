from manim import *

class AlgorithmVisualizationScene(Scene):
    def construct(self):
        # Define Mobjects with initial properties and positions
        # Scene 1 elements
        title = Text("Merge Sort: Splitting", font_size=48, color=WHITE).to_edge(UP)
        initial_array = MathTex("[5, 8, 2, 3]", font_size=42, color=YELLOW).next_to(title, DOWN, buff=1)

        # Scene 2 elements
        split_label_1 = Text("Split", font_size=30, color=GRAY).next_to(initial_array, DOWN, buff=0.5)
        left_half_1 = MathTex("[5, 8]", font_size=42, color=YELLOW)
        right_half_1 = MathTex("[2, 3]", font_size=42, color=YELLOW)
        # Position the halves relative to the split label, arranged horizontally
        first_split_group = VGroup(left_half_1, right_half_1).arrange(RIGHT, buff=1).next_to(split_label_1, DOWN, buff=0.5)

        # Scene 3 elements (Left split)
        split_label_2a = Text("Split", font_size=30, color=GRAY).next_to(left_half_1, DOWN, buff=0.5)
        left_half_2a = MathTex("[5]", font_size=42, color=YELLOW)
        right_half_2a = MathTex("[8]", font_size=42, color=YELLOW)
        # Position the single elements relative to the split label, arranged horizontally
        second_split_left_group = VGroup(left_half_2a, right_half_2a).arrange(RIGHT, buff=0.5).next_to(split_label_2a, DOWN, buff=0.5)

        # Scene 4 elements (Right split)
        split_label_2b = Text("Split", font_size=30, color=GRAY).next_to(right_half_1, DOWN, buff=0.5)
        left_half_2b = MathTex("[2]", font_size=42, color=YELLOW)
        right_half_2b = MathTex("[3]", font_size=42, color=YELLOW)
        # Position the single elements relative to the split label, arranged horizontally
        second_split_right_group = VGroup(left_half_2b, right_half_2b).arrange(RIGHT, buff=0.5).next_to(split_label_2b, DOWN, buff=0.5)

        # Scene 5 elements
        # Position relative to left_half_2a as per plan
        final_state_label = Text("Split into single elements", font_size=36, color=GREEN).next_to(second_split_left_group, DOWN, buff=0.5)

        # --- Scene 1: Initial Array ---
        # Duration: 5
        # Animations:
        # - title: FadeIn (duration=1.5, start_time=0)
        # - initial_array: Write (duration=2, start_time=2)

        # Play animations using AnimationGroup for precise timing
        # Calculate max end time for the group
        max_end_time_scene1 = max(0 + 1.5, 2 + 2) # max(1.5, 4) = 4
        self.play(
            AnimationGroup(
                FadeIn(title, run_time=1.5, begin=0),
                Write(initial_array, run_time=2, begin=2)
            )
        )
        # Wait for the remaining time in the scene duration
        self.wait(5 - max_end_time_scene1)


        # --- Scene 2: First Split ---
        # Duration: 4
        # Elements: title (persists), initial_array (fades out), split_label_1, left_half_1, right_half_1
        # Animations:
        # - initial_array: FadeOut (duration=1, start_time=0.5)
        # - split_label_1: FadeIn (duration=1, start_time=1)
        # - left_half_1: FadeIn (duration=1.5, start_time=1.5)
        # - right_half_1: FadeIn (duration=1.5, start_time=1.5)

        # Add new elements (initially invisible) before animating them
        self.add(split_label_1, left_half_1, right_half_1)

        # Play animations using AnimationGroup
        max_end_time_scene2 = max(0.5 + 1, 1 + 1, 1.5 + 1.5, 1.5 + 1.5) # max(1.5, 2, 3, 3) = 3
        self.play(
            AnimationGroup(
                FadeOut(initial_array, run_time=1, begin=0.5),
                FadeIn(split_label_1, run_time=1, begin=1),
                FadeIn(first_split_group, run_time=1.5, begin=1.5)
            )
        )
        # Wait for the remaining time in the scene duration
        self.wait(4 - max_end_time_scene2)


        # --- Scene 3: Second Split (Left) ---
        # Duration: 4
        # Elements: title, split_label_1, right_half_1 (persist), left_half_1 (fades out), split_label_2a, left_half_2a, right_half_2a
        # Animations:
        # - left_half_1: FadeOut (duration=1, start_time=0.5)
        # - split_label_2a: FadeIn (duration=1, start_time=1)
        # - left_half_2a: FadeIn (duration=1.5, start_time=1.5)
        # - right_half_2a: FadeIn (duration=1.5, start_time=1.5)

        # Add new elements (initially invisible) before animating them
        self.add(split_label_2a, left_half_2a, right_half_2a)

        # Play animations using AnimationGroup
        max_end_time_scene3 = max(0.5 + 1, 1 + 1, 1.5 + 1.5, 1.5 + 1.5) # max(1.5, 2, 3, 3) = 3
        self.play(
            AnimationGroup(
                FadeOut(left_half_1, run_time=1, begin=0.5),
                FadeIn(split_label_2a, run_time=1, begin=1),
                FadeIn(second_split_left_group, run_time=1.5, begin=1.5)
            )
        )
        # Wait for the remaining time in the scene duration
        self.wait(4 - max_end_time_scene3)


        # --- Scene 4: Second Split (Right) ---
        # Duration: 4
        # Elements: title, split_label_1, split_label_2a, left_half_2a, right_half_2a (persist), right_half_1 (fades out), split_label_2b, left_half_2b, right_half_2b
        # Animations:
        # - right_half_1: FadeOut (duration=1, start_time=0.5)
        # - split_label_2b: FadeIn (duration=1, start_time=1)
        # - left_half_2b: FadeIn (duration=1.5, start_time=1.5)
        # - right_half_2b: FadeIn (duration=1.5, start_time=1.5)

        # Add new elements (initially invisible) before animating them
        self.add(split_label_2b, left_half_2b, right_half_2b)

        # Play animations using AnimationGroup
        max_end_time_scene4 = max(0.5 + 1, 1 + 1, 1.5 + 1.5, 1.5 + 1.5) # max(1.5, 2, 3, 3) = 3
        self.play(
            AnimationGroup(
                FadeOut(right_half_1, run_time=1, begin=0.5),
                FadeIn(split_label_2b, run_time=1, begin=1),
                FadeIn(second_split_right_group, run_time=1.5, begin=1.5)
            )
        )
        # Wait for the remaining time in the scene duration
        self.wait(4 - max_end_time_scene4)


        # --- Scene 5: Final Split State ---
        # Duration: 3
        # Elements: All previous visible elements persist, final_state_label appears
        # Animations:
        # - final_state_label: FadeIn (duration=1.5, start_time=0.5)

        # Add new element (initially invisible) before animating it
        self.add(final_state_label)

        # Play animations using AnimationGroup
        max_end_time_scene5 = 0.5 + 1.5 # 2
        self.play(
            AnimationGroup(
                FadeIn(final_state_label, run_time=1.5, begin=0.5)
            )
        )
        # Wait for the remaining time in the scene duration
        self.wait(3 - max_end_time_scene5)

        # Final wait at the end of the animation
        self.wait()
