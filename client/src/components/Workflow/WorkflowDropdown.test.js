import WorkflowDropdown from "./WorkflowDropdown";
import { mount } from "@vue/test-utils";
import { getLocalVue } from "tests/jest/helpers";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import flushPromises from "flush-promises";
import { ROOT_COMPONENT } from "utils/navigation";

const localVue = getLocalVue(true);

const TEST_WORKFLOW_NAME = "my workflow";
const TEST_WORKFLOW_DESCRIPTION = "my cool workflow description";

describe("WorkflowDropdown.vue", () => {
    let wrapper;
    let propsData;

    function initWrapperForWorkflow(workflow) {
        propsData = {
            root: "/root/",
            workflow: workflow,
        };
        wrapper = mount(WorkflowDropdown, {
            propsData,
            localVue,
        });
    }

    function workflowOptions() {
        return wrapper.findAll(".dropdown-menu .dropdown-item");
    }

    describe("for workflows owned by user", () => {
        beforeEach(async () => {
            const workflow = {
                name: TEST_WORKFLOW_NAME,
                id: "workflowid123",
                description: TEST_WORKFLOW_DESCRIPTION,
                owner: "test",
            };
            initWrapperForWorkflow(workflow);
        });

        it("should not display source metadata if not present", async () => {
            expect(wrapper.find(ROOT_COMPONENT.workflows.trs_icon.selector).exists()).toBeFalsy();
            expect(wrapper.find(ROOT_COMPONENT.workflows.external_link.selector).exists()).toBeFalsy();
        });

        it("should display name and description", async () => {
            expect(wrapper.find(".workflow-dropdown-name").text()).toBe(TEST_WORKFLOW_NAME);
            expect(wrapper.find(".workflow-dropdown-description").text()).toBe(TEST_WORKFLOW_DESCRIPTION);
        });

        it("should provide all owner workflow options", () => {
            expect(workflowOptions().length).toBeGreaterThan(2);
        });
    });

    describe("workflows without annotations", () => {
        beforeEach(async () => {
            const workflow = {
                name: TEST_WORKFLOW_NAME,
                id: "workflowid123",
                owner: "test",
            };
            initWrapperForWorkflow(workflow);
        });

        it("should display name but not description", async () => {
            expect(wrapper.find(".workflow-dropdown-name").text()).toBe(TEST_WORKFLOW_NAME);
            expect(wrapper.find(".workflow-dropdown-description").exists()).toBeFalsy();
        });
    });

    describe("for workflows shared with user", () => {
        beforeEach(async () => {
            const workflow = {
                name: TEST_WORKFLOW_NAME,
                id: "workflowid123",
                description: TEST_WORKFLOW_DESCRIPTION,
                shared: true,
            };
            initWrapperForWorkflow(workflow);
        });

        it("should provide a limited number of options", () => {
            expect(workflowOptions().length).toBe(3);
            expect(workflowOptions().at(0).text()).toBeLocalizationOf("Copy");
            expect(workflowOptions().at(1).text()).toBeLocalizationOf("Download");
            expect(workflowOptions().at(2).text()).toBeLocalizationOf("View");
        });
    });

    describe("workflow clicking workflow deletion", () => {
        let axiosMock;

        async function mountAndDelete() {
            const workflow = {
                name: TEST_WORKFLOW_NAME,
                id: "workflowid123",
                description: TEST_WORKFLOW_DESCRIPTION,
                owner: "test",
            };
            initWrapperForWorkflow(workflow);
            await wrapper.vm.onDelete();
            await flushPromises();
        }

        beforeEach(async () => {
            axiosMock = new MockAdapter(axios);
            axiosMock.onDelete("/api/workflows/workflowid123").reply(202, "deleted...");
            axiosMock.onPost("/api/workflows/workflowid123/undelete").reply(204, "restored...");
        });

        afterEach(() => {
            axiosMock.restore();
        });

        it("should fire deletion API request upon remove action", async () => {
            await mountAndDelete();
            const emitted = wrapper.emitted();
            expect(emitted["onRemove"][0][0]).toEqual("workflowid123");
            expect(emitted["onSuccess"][0][0]).toEqual("deleted...");
        });

        it("should restore previously deleted workflows", async () => {
            await mountAndDelete();
            const emitted = wrapper.emitted();
            expect(emitted["onRemove"][0][0]).toEqual("workflowid123");
            expect(emitted["onSuccess"][0][0]).toEqual("deleted...");
            await wrapper.vm.onRestore();
            await flushPromises();
            expect(emitted["onRestore"][0][0]).toEqual("workflowid123");
            expect(emitted["onSuccess"][1][0]).toEqual("restored...");
        });
    });
});
