import asyncio
from backend.routers.chatbot import agent, StoreDeps

async def main():
    deps = StoreDeps()
    try:
        res = await agent.run("can you suggest me women's clothing", deps=deps)
        print("Success:", res.output)
        print("Found Products:", len(deps.found_products))
        if deps.found_products:
            print("First product:", deps.found_products[0].get("title"))
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
