from time import sleep
from flask import Flask, jsonify, request, send_file, Response,  stream_with_context
from flask_cors import CORS
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from SystemPrompts.execute import system_prompt, debug_prompt
from SystemPrompts.planning import system_prompt_planner
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
import subprocess
from dotenv import load_dotenv

# from waitress import serve
load_dotenv()
app = Flask(__name__)
CORS(app)

# Define the desired structure
class ManimScript(BaseModel):
    """Manim script."""
    code: str = Field(..., description="manim script code with imports")
    classname: str = Field(..., description="classname for manim script")
    instructions: str = Field(..., description="summery of manim script")

# --- Constants ---
MAX_ATTEMPTS = 10

def generateSequences(query: str):
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-04-17", temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt_planner.replace("{", "{{").replace("}", "}}")),
        ("human", "Generate animation sequences for Manim that give full context and avoid errors for this input:- {input}"),
    ])
    parser = JsonOutputParser(pydantic_object=ManimScript)
    chain = prompt | llm | parser
    print("[💾] Generated The Sequence, How its going to work!")
    return chain.invoke({"input": query})

def generateScript(sequence) -> ManimScript:
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-04-17", temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt.replace("{", "{{").replace("}", "}}")),
        ("human", "Generate error-free, production ready manim animation script based on this sequences: {input}"),
    ])
    parser = JsonOutputParser(pydantic_object=ManimScript)
    chain = prompt | llm | parser
    print("[✅] Generated The Initial Script")
    return chain.invoke({"input": sequence})
# result = generateScript("Create Circle Animation")

def writeInFile(parsed):
    print(type(parsed))  # Should be <class 'dict'>
    try:
        with open("generate.py", "w") as file:
            print(parsed['code'])
            file.write(parsed['code'])
        print("[💾] Code written to generate.py")
    except Exception as e:
        print(f"[❌] Writing to file failed: {e}")


def debugCode(code) -> ManimScript:
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", debug_prompt.replace("{", "{{").replace("}", "}}")),
        ("human", "find all the errors and fix the code, make sure to check all the code. this is the code -> {input}"),
    ])
    parser = JsonOutputParser(pydantic_object=ManimScript)
    chain = prompt | llm | parser
    print("[💾] Debugging Done")
    return chain.invoke({"input": code['code']})
# result = generateScript("Create Circle Animation")

def writeInFile(parsed):
    print(type(parsed))  # Should be <class 'dict'>
    try:
        with open("generate.py", "w",  encoding="utf-8") as file:
            print(parsed['code'])
            file.write(parsed['code'])
        print("[💾] Code written to generate.py")
    except Exception as e:
        print(f"[❌] Writing to file failed: {e}")


def fixScript(error_message: str, current_code: str, depth: int = 1) -> ManimScript:
    if depth > 3:
        print("[🔁] Fixing recursion limit reached.")
        return ManimScript(code=current_code, classname="Unknown", instructions="Fix failed.")

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
        parser = JsonOutputParser(pydantic_object=ManimScript)

        sleep(5)
        print("Taking 10 sec Break")
        sleep(10)
        print("Ready>")
        sleep(5)
        # Define prompt and structured chain
        prompt = ChatPromptTemplate.from_messages([
            ("system", """
    You are a Manim animation expert and code debugger.

    Your task is to analyze Manim code, identify issues, and return corrected code that keeps the same animation intent. You must also explain the errors briefly unless instructed otherwise.

    ## Rules:
    - Target Manim Community Edition (latest version).
    - Check for common issues like wrong syntax, deprecated functions, missing imports, object misuse, etc.
    - Keep the animation logic, style, and structure as close to the original as possible.
    - If a function is incorrect, replace it with a valid one (`FadeIn`, `Write`, `Create`, etc.).
    - If an object is misused (e.g., treating `Text` like a list), fix it.
    - Handle missing `self.wait()` or `self.play()` issues if relevant.
    - Output both the **corrected code** and a **summary of the fixes**.

    ## Input Format:
    The user will provide faulty or non-working Manim code. You will respond with:

    1. A brief explanation of the issues
    2. The corrected Python code in a single block


"""),
            ("human", """Fix this ManimCE code with the given error:
                        ```python
                        {code}
                        ```

                        Error message:
                        ```
                        {error}
                        ```

                        Return JSON with:
                "classname": the class name
                "code": fixed code
                "instructions": what the animation does
             """)])

        chain = prompt | llm | parser
        # Invoke chain with input
        return chain.invoke({"code": current_code, "error": error_message})
    except Exception as e:
        print(f"[⚠️] Fix failed at depth {depth}, retrying...")
        return fixScript(f"{error_message}\n\n{e}", current_code, depth + 1)

def executeWithAutoFix(parsed):
    if not parsed:
        print("[❌] No parsed code to execute.")
        return

    for attempt in range(1, MAX_ATTEMPTS + 1):
        writeInFile(parsed)
        command = f"manim -ql generate.py {parsed['classname']}"

        try:
            result = subprocess.run(
                command,
                shell=True,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            print("[✅] Execution successful!")
            print(result.stdout)
            path = f"media/videos/generate/480p15/{parsed['classname']}.mp4"
            return path

        except subprocess.CalledProcessError as e:
            error_msg = e.stderr or e.stdout or str(e)
            print(f"[❌] Attempt {attempt}/{MAX_ATTEMPTS} failed:\n{error_msg}\nTrying auto-fix...")
            parsed = fixScript(error_msg, parsed.get('code', ''), depth=1)

    print("[🚫] Max attempts reached. Could not execute successfully.")

@app.route('/', methods=['GET', 'POST'])
def hello_world():
   return 'Hello World'


@app.route('/generate', methods=['POST'])
def generate():
    query = request.form['query']  # or request.json['query'] if it's JSON

    @stream_with_context
    def generate_stream():

        yield f"Starting Animation: {query}\n"
        result = generateSequences(query)
        yield f"Preparing: {query}!\n"
        code = generateScript(result)
        yield f"Generating Code: {code['classname']}."
        yield f"\n"
        yield f"{code['instructions']}"

        debugged_code = debugCode(code)
        yield "Fixing Errors!\n"
        path = executeWithAutoFix(debugged_code)  # path should be a valid video file path

        if path:
            yield f"<path>{path}</path> : contains the video\n"
        else:
            yield "Failed to generate video after multiple attempts.\n"
        # Make sure the file exists and is a video
        # return send_file(path, mimetype='video/mp4')
    return Response(generate_stream(),  status=200, content_type="text/event-stream")


@app.route('/stream', methods=["GET","POST"])
def stream_data():

    def generate():
        for i in range(10):
            sleep(1)
            yield f"Data chunk {i}\n"
    return Response(generate(), status=200, content_type="text/event-stream")


@app.route('/video', methods=['POST'])
def get_video():
    path = request.form['path']
        # Convert to an absolute path using os.path.join() to handle platform-specific file separators
    video_path = os.path.join(os.getcwd(), path)

    print(f"Video path: {video_path}")  # Log the path to check if it's correct

    # Check if the file exists
    if os.path.exists(video_path):
        return send_file(video_path, mimetype="video/mp4", as_attachment=False)
    else:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    # serve(app, host='0.0.0.0', port=5000)
    app.run(debug=True, threaded=True, use_reloader=False)
