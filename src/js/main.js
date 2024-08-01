jQuery(document).ready(function ($) {
    /** Top menu sub items toggle */
    $("li.has-sub-menu").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(e.target).next(".sub-menu").toggleClass('active');
    });

    function showPhoneMenu() {
        $(".burger-menu__menu").addClass("active");
        $("body").addClass("disable-scroll");
    }

    function hidePhoneMenu() {
        $(".burger-menu__menu").removeClass("active");
        $("body").removeClass("disable-scroll");
    }

    $(".burger-menu").click(function(event) {
        event.stopPropagation();
        showPhoneMenu();
    });


    /** Appointment multilevel categories */
    function createSubCategoryList(subCategories, level = 0) {
        let $subList = $('<ul></ul>').addClass('sub-category-list level-' + level);
    
        if (!Array.isArray(subCategories)) {
            return $subList; 
        }

        subCategories.forEach(function (subCategory) {
            if ('id' in subCategory && 'name' in subCategory) {
                const { id, name } = subCategory;
                let $subCategoryItem = $('<li class="category-btn"></li>').html('<a href="#" data-id="' + id + '">' + name + '</a>');
                $subList.append($subCategoryItem);
            } else {
                Object.entries(subCategory).forEach(([k, v]) => {
                    let $subCategoryItem = $('<li class="category-btn has-child" data-id=""><span></span></li>').html('<span>' + k + '</span>');
                    let $nestedList = createSubCategoryList(v, level + 1);
                    $subCategoryItem.append($nestedList);
                    $subList.append($subCategoryItem);
                });
            }
        });
    
        return $subList;
    }

    /** Handle hover events for showing sub-categories */
    $('.sub-category-list').hide();

    function bindClickEvents() {
        $('.category-btn').off('click').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
    
            let $this = $(this);

            if ($this.children('a').length > 0) {
                return;
            }

            let $existingSubList = $this.children('.sub-category-list');
            $this.addClass('opened');
    
            if ($existingSubList.length === 0) {
                let subCategories = $this.data('sub');
                let $newSubList = createSubCategoryList(subCategories);
                
                $this.append($newSubList);
                $newSubList
                    .hide()
                    .slideDown(10)
                    .addClass('active');
                    
                bindClickEvents();
            } else {
                $existingSubList
                    .stop(true, true)
                    .slideToggle(10)
                    .toggleClass('active');
            }
    
            $this.siblings().each(function () {
                let $siblingSubList = $(this).children('.sub-category-list');
                $siblingSubList
                    .stop(true, true)
                    .slideUp(10)
                    .removeClass('active');
    
                $(this).removeClass('opened').addClass('not-clicked');
            });
    
            $this.removeClass('not-clicked');
            $this.find('.category-btn').removeClass('not-clicked');
        });
    }
    
    bindClickEvents();

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.burger-menu__menu').length ) {
            hidePhoneMenu();
        }

        if (!$(e.target).closest('.has-sub-menu').length) {
            $('.sub-menu').removeClass('active');
        }
        if (!$(e.target).closest('.category-btn').length) {
            $('.sub-category-list').stop(true, true).slideUp(10).removeClass('active');
            $('.category-btn').removeClass('not-clicked');
        }
    });
});