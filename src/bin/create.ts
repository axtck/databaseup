#!/usr/bin/env node
import { create } from "../create";

create().catch((e) => {
    console.log("something went wrong", e);
});