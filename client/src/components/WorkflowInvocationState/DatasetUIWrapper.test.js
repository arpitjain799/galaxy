import DatasetUIWrapper from "./DatasetUIWrapper";
import DatasetUI from "../History/ContentItem/Dataset/DatasetUI";
import { shallowMount } from "@vue/test-utils";
import raw from "../History/test/json/Dataset.json";

jest.mock("../History/caching");

describe("DatasetUIWrapper.vue with Dataset", () => {
    let wrapper;
    let propsData;
    let onDelete;
    let onUnhide;
    let onUndelete;
    let updateDataset;

    beforeEach(async () => {
        propsData = {
            item: raw,
        };
        onDelete = jest.spyOn(DatasetUIWrapper.methods, "onDelete").mockImplementation();
        onUnhide = jest.spyOn(DatasetUIWrapper.methods, "onUnhide").mockImplementation();
        onUndelete = jest.spyOn(DatasetUIWrapper.methods, "onUndelete").mockImplementation();
        updateDataset = jest.spyOn(DatasetUIWrapper.methods, "onUpdate").mockImplementation();
        wrapper = shallowMount(DatasetUIWrapper, {
            propsData,
        });
    });

    it("loads DatasetUI component", async () => {
        expect(wrapper.findComponent(DatasetUI).exists()).toBeTruthy();
    });

    it("reacts to all emittted events", async () => {
        expect(onDelete).not.toHaveBeenCalled();
        expect(onUnhide).not.toHaveBeenCalled();
        expect(onUndelete).not.toHaveBeenCalled();
        expect(updateDataset).not.toHaveBeenCalled();
        wrapper.findComponent(DatasetUI).vm.$emit("deleteDataset");
        expect(onDelete).toHaveBeenCalled();
        wrapper.findComponent(DatasetUI).vm.$emit("undeleteDataset");
        expect(onUndelete).toHaveBeenCalled();
        wrapper.findComponent(DatasetUI).vm.$emit("unhideDataset");
        expect(onUnhide).toHaveBeenCalled();
        wrapper.findComponent(DatasetUI).vm.$emit("updateDataset");
        expect(updateDataset).toHaveBeenCalled();
    });
    it("handles element identifier", async () => {
        expect(wrapper.vm.dataset.canEditName).toBeTruthy();
        await wrapper.setProps({ element_identifier: "a cool identifier" });
        expect(wrapper.vm.dataset.title).toBe("a cool identifier");
        expect(wrapper.vm.dataset.canEditName).toBeFalsy();
    });
});
